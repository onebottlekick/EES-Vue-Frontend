<template>
    <v-container>
        <h2>Commutity</h2>
        <v-card v-if="board">
            <v-card-title>게시물 정보</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="title" label="제목" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="board.writer" readonly label="작성자" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-textarea v-model="content" label="내용" auto-grow />
                        </v-col>
                    </v-row>
                    <v-row justify="end">
                        <v-col cols="auto">
                            <v-btn color="primary" @click="onModify">수정 완료</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <router-link :to="{ name: 'BoardReadPage' }">
                                <v-btn color="secondary">돌아가기</v-btn>
                            </router-link>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const boardModule = 'boardModule'

export default {
    props: {
        board_id: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            title: '',
            writer: '',
            content: '',
        }
    },
    computed: {
        ...mapState(boardModule, ['board'])
    },
    methods: {
        ...mapActions(boardModule, ['requestBoardToDjango', 'requestModifyBoardToDjango']),
        async onModify() {
            const payload = {
                title: this.title,
                content: this.content,
                board_id: this.board_id,
            }

            await this.requestModifyBoardToDjango(payload)
            await this.$router.push({
                name: 'BoardReadPage',
                params: { board_id: this.board_id }
            })
        },
    },
    created() {
        this.requestBoardToDjango(this.board_id).then(() => {
            this.title = this.board.title
            this.writer = this.board.writer
            this.content = this.board.content
        })
    },
}
</script>